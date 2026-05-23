import Icon from '~/uikit/icons/components/icon';
import classnames from 'classnames';

const CreateNavigationSlideIcon = ({
  icon,
  isSelected = false
}: {
  icon: string,
  isSelected: boolean
}) => {
  return (
    <div className={classnames("rounded-md p-2", {
      "border-2 border-blue-400": isSelected
    })}>
      <Icon icon={icon} size={16} />
    </div>
  );
};

export default CreateNavigationSlideIcon;